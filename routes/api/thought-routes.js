const router = require('express').Router()
const {getAllThought, getThoughtById, addThought, updateThought,
    removeThought, 
    addReaction, 
    removeReaction} = require('../../controllers/thought-controller')


    router
    .route('/')
    .get(getAllThought)
    .post(addThought)

    router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(removeThought)

    router.route('/:thoughtId/reactions')
    .post(addReaction)
    .delete(removeReaction)
    
module.exports= router