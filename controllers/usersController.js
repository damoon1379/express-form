const usersStorage=require('../storages/usersStorage');
const {body,validationResult}=require('express-validator');

const alphaErr="must only contains letters";
const lengthErr = "must be between 1 and 10 characters";

const validateUser = [
    body('firstName').trim()
    .isAlpha().withMessage(`first name ${alphaErr}`)
    .isLength({min:0, max:10}).withMessage(`First name ${lengthErr}`),
    body("lastName").trim()
    .isAlpha().withMessage(`last name ${alphaErr}`)
    .isLength({min:0,max:10}).withMessage(`last name ${lengthErr}`)
];

exports.usersListGet = (req,res)=>{
    res.render('index',{
        title:'User List',
        users: usersStorage.getUsers(),
    });
};

exports.usersCreateGet = (req,res)=>{
    res.render('createUser',{
        title:'create user',
    });
};

exports.usersCreatePost = [validateUser,(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).render('createUser',{
            title:'create user',
            errors:errors.array(),
        });
    }
    const {firstName,lastName}=req.body;
    usersStorage.addUser({firstName,lastName});
    res.redirect('/');
}];

exports.usersUpdateGet = (req,res)=>{
    const user = usersStorage.getUser(req.params.id);
    res.render('updateUser',{
        title:"update user",
        user:user,
    });
};

exports.usersUpdatePost = [validateUser,(req,res)=>{
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).render('updateUser',{
            title: 'update user',
            user:user,
            errors:errors.array(),
        });
    }
    const {firstName,lastName}=req.body;
    usersStorage.updateUser(req.params.id,{firstName,lastName});
    res.redirect('/');
}];

exports.usersDeletePost  = (req,res)=>{
    usersStorage.deleteUser(req.params.id);
    res.redirect('/');
};