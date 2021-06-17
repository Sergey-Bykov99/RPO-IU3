class Utils {

    saveUser(user){
        localStorage.setItem('user', JSON.stringify(user))
    }

    removeUser(){
        localStorage.removeItem('user')
    }

    getToken(){
        let user = JSON.parse(localStorage.getItem('user'))
        return user && "Bearer" + user.token;
    }

    getUserName(){
        let user = JSON.parse(localStorage.getItem('user'))
        return user && user.login;
    }

    getUser(){
        return JSON.parse(localStorage.getItem('user'))
    }
}

export default new Utils()