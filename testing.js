const inviteBusinessConnection = async function (refCode, db, business_entity) {
  let transaction = await db.sequelize.transaction();
  let invite = null;
  let inviter_business_entity = null;

  // check if refCode exist -- execute connection/vendor record procedure only if refCode is valid
  if (refCode.length > 0) {
    invite = await db.business_entity_invite.findOne({
      where: {
        invite_code: refCode,
        // invite_source: constant.BUSINESS_ENTITY_INVITE_SOURCE.EPD,
        status: constant.BUSINESS_ENTITY_INVITE.NEW
      }
    }, { transaction });

    //if refCode is valid
    if (invite != null) {
      try {
        inviter_business_entity = await db.business_entity.findOne({
          where: {
            business_entity_id: invite.business_entity_id
          }
        }, { transaction });

        //check if existing connection request already exist
        let conn = await checkExistingReq(db, transaction, invite.business_entity_id, business_entity.dataValues.business_entity_id);

        //if no existing connection, then insert
        if (conn == null) {
          let conn = await db.connection.create({
            requester_id: invite.business_entity_id,
            recipient_id: business_entity.dataValues.business_entity_id,
            datetime: new Date(),
            status: constant.BUSINESS_ENTITY_CONNECTION.CONNECTED
          }, { transaction });

          if (conn != null) {
            const invite_update = await db.business_entity_invite.update({
              status: constant.BUSINESS_ENTITY_INVITE.ACCEPTED,
              update_date: new Date()
            }, {
              where: {
                invite_code: refCode,
                // invite_source: constant.BUSINESS_ENTITY_INVITE_SOURCE.EPD,
                status: constant.BUSINESS_ENTITY_INVITE.NEW
              }
            }, { transaction });
          }
        } else { //else don't insert new request
          const invite_update = await db.business_entity_invite.update({
            status: constant.BUSINESS_ENTITY_INVITE.ACCEPTED,
            update_date: new Date()
          }, {
            where: {
              invite_code: refCode,
              // invite_source: constant.BUSINESS_ENTITY_INVITE_SOURCE.EPD,
              status: constant.BUSINESS_ENTITY_INVITE.NEW
            }
          }, { transaction });
        }
        await transaction.commit();
      } catch (err) {
        if (transaction) await transaction.rollback();
      }

      //create vendor create for both parties after connection
      try {
        let transaction = await db.sequelize.transaction();
        await createVendorRecord(db, transaction, inviter_business_entity, business_entity);
        await transaction.commit();
        await sendEmail({
          db,
          vendorId: vendor_id,
          partnerName: business_entity.business_name,
          enterpriseName: inviter_business_entity.business_name,
          businessEntityId: inviter_business_entity.business_entity_id
        });
      } catch (err) {
        if (transaction) await transaction.rollback();
      }

      //insert new request for other inviters
      if (invite != null) {
        let transaction = await db.sequelize.transaction();
        try {
          //assign other inviter to connection request list
          let invite_list = await db.business_entity_invite.findAll({
            where: {
              invite_company_uen: invite.invite_company_uen,
              invite_company_country_code: invite.invite_company_country_code,
              status: constant.BUSINESS_ENTITY_INVITE.NEW
            }
          });

          //loop through all valid inviters
          _.forEach(invite_list, async (item) => {

            //check if existing connection request already exist
            let conn = await checkExistingReq(db, transaction, constant, item.business_entity_id, business_entity.dataValues.business_entity_id);

            if (conn == null) { // don't exist
              let conn = await db.connection.create({
                requester_id: item.business_entity_id,
                recipient_id: business_entity.dataValues.business_entity_id,
                datetime: new Date(),
                status: constant.BUSINESS_ENTITY_CONNECTION.NEW
              });
              if (conn) {
                await db.business_entity_invite.update({
                  status: constant.BUSINESS_ENTITY_INVITE.ACCEPTED,
                  update_date: new Date()
                }, {
                  where: {
                    business_entity_invite_id: item.business_entity_invite_id
                  }
                });
              }
            } else {
              await db.business_entity_invite.update({
                status: constant.BUSINESS_ENTITY_INVITE.ACCEPTED,
                update_date: new Date()
              }, {
                where: {
                  business_entity_invite_id: item.business_entity_invite_id
                }
              });
            }
          });

          await transaction.commit();

        } catch (err) {
          if (transaction) await transaction.rollback();
          console.log('failed to create connection request for other inviters');
        }
      }
    }
  }
};
