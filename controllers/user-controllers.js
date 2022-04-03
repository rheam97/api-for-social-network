const {User, Thought} = require('../models')


const userController = {
// get all users
getAllUsers(req, res){
    User.find({})
    .populate({
        path: 'friends',
        select: '-__v'
    })
    .populate({
        path: 'thoughts',
        select: '-__v'
    })
    .select('-__v')
    .sort({_id: -1})
    .then(dbUserData=> res.json(dbUserData))
    .catch(err=> {
        console.log(err)
        res.status(400).json(err)
    })
},

//get user by id
getUserById({params}, res){
    User.findOne({_id: params.id})
    .populate({
        path: 'friends',
        select: '-__v'
    })
    .populate({
        path: 'thoughts',
        select: '-__v'
    })
    .select('-__v')
    .then(dbUserData=>{
        if(!dbUserData){
            res.status(404).json({message: 'No user found with this id'})
            return
        }
        res.json(dbPUserData)
    })
    .catch(err=> {
        console.log(err)
        res.status(400).json(err)
    })
},

//post new user
createUser({body}, res){
    User.create(body)
    .then(dbUserData=> res.json(dbUserData))
    .catch(err=> res.status(400).json(err))
},


//update user by id
updateUserbyId({params, body}, res){
    User.findOneAndUpdate({_id:params.id}, body, {new:true, runValidators: true})
    .then(dbUserData=> {
        if(!dbUserData){
            res.status(404).json({message: 'No user found with this id.'})
            return
        }
        res.json(dbUserData)
    })
    .catch(err=> {
        res.json(err)
    })
},

//delete user by id (delete thoughts as well)
deleteUserbyId({params}, res){
    User.findOneAndDelete({_id:params.id})
    .then(dbUserData=> {
        if(!dbUserData){
            res.status(404).json({message: 'No user found with this id'})
            return
        }
        res.json(dbUserData)
        return Thought.deleteMany({username: params.username}, function(err, result){
            if(err){
                res.status(err)
            }
            else{
                res.send(result)
            }
        })
    })
    .catch(err=> res.status(400).json(err))
},

}
