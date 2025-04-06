package com.example.swiftthrift.app

import android.app.Application
import android.util.Log

class MyApplication : Application(){
    var name:String=""
    var birthday:String=""
    var phoneNum:String=""
    var email:String=""
    var username:String=""
    var password:String=""

    override fun onCreate() {
        super.onCreate()
        Log.e("SwiftThrift","The Application is called.")
    }
}