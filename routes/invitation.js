/**
 * recording and dealing the join & invitation requests to other groups
 */
module.exports = function (router, pool) {


    invitationNumRoute = router.route('/invitation/num/:id')
    invitationNumRoute.get((req, res) => {
        var net_id = req.params.id;
        pool.query('SELECT count(*) FROM invitations i JOIN groups g on (i.group_id = g.group_id) WHERE receiver = ?', net_id, function (error, results, fields){
            if(error){
                res.status(500).send({ data: error, message: error})
            } else{
                res.status(200).send({ data: results[0]['count(*)'], message: "Successfully returned all invitations of user " + net_id})
            }
        })
    })

    /**
     * retrive all invitations for a specific user
     */
    invitationReceiverRoute = router.route('/invitation/receiver/:id')

    invitationReceiverRoute.get((req, res) => {
        var net_id = req.params.id;
        pool.query('SELECT * FROM invitations i JOIN groups g on (i.group_id = g.group_id) WHERE receiver = ?', net_id, function (error, results, fields){
            if(error){
                res.status(500).send({ data: error, message: error})
            } else{
                res.status(200).send({ data: results, message: "Successfully returned all invitations of user " + net_id})
            }
        })
    })

    /**
     * Create an invitation
     */

    invitationRoute = router.route('/invitation')

    invitationRoute.post((req, res) => {
        var sender = req.body.sender;
        var receiver = req.body.receiver;
        var group_id = req.body.group_id;
        //1 means a group member invites a guy from queue, 0 means a user asks to join
        var invitation_type = req.body.invitation_type;
        var invitation = {
            sender: sender,
            receiver: receiver,
            group_id: group_id, 
            invitation_type: invitation_type,
        }

        pool.query('INSERT INTO invitations SET ?', invitation, function (error, results, fields){
            if(error){
                res.status(500).send({ data: error, message: error})
            } else{
                res.status(200).send({ data: invitation, message: "Successfully created an invitation from " + sender + " of group " + group_id + " to " + receiver})
            }
        })

    })

    /**
     * deal with an invitation (delete the invitation upon acceptance or rejection from the receiver)
     */
    
    invitationDealingRoute = router.route('/invitation/:id')

    invitationDealingRoute.delete((req, res) => {
        var invitation_id = req.params.id;

        pool.query('DELETE FROM invitations WHERE invitation_id = ?', invitation_id, function (error, results, fields){
            if(error){
                res.status(500).send({ data: error, message: error})
            } else{
                res.status(200).send({ data: invitation_id, message: "Successfully deleted invitation " + invitation_id})
            }
        })
    })



    return router;
}
