package com.example.swiftthrift.app

import android.app.Application
import android.util.Log

class MyApplication : Application(){
    var lname:String=""
    var fname:String=""
    var birthday:String=""
    var phoneNum:String=""
    var email:String=""
    var username:String=""
    var password:String=""
    var jwtToken: String? = null
    var login_username: String? = null
    var login_password: String? = null
    override fun onCreate() {
        super.onCreate()
        Log.e("SwiftThrift","The Application is called.")
    }
}