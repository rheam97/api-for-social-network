const router = require('express').Router()
const {getAllUsers, getUserById, updateUserById, createUser, 
    deleteUserById, 
    addFriend, 
    deleteFriend} = require('../../controllers/user-controllers')

    router
    .route('/')
    .get(getAllUsers)
    .post(createUser)
    
    
    router
    .route('/:id')
    .get(getUserById)
    .put(updateUserById)
    .delete(deleteUserById)

    router
    .route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(deleteFriend)

    module.exports = router