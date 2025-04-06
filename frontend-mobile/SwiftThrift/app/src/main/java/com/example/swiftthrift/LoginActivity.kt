package com.example.swiftthrift

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import com.example.swiftthrift.app.MyApplication
import com.example.swiftthrift.fragments.HomeFragment

class LoginActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        val textViewRegister:TextView = findViewById(R.id.textView_Register)
        val username:EditText=findViewById(R.id.editText_Username)
        val password:EditText=findViewById(R.id.editText_Password)
        val loginButton:Button=findViewById(R.id.button_login)
        username.setText((application as MyApplication).username)
        password.setText((application as MyApplication).password)
        textViewRegister.setOnClickListener{
            val intent = Intent(this,RegisterStep1::class.java)
            startActivity(intent)
        }
        loginButton.setOnClickListener{
            val intent = Intent(this, HomePage::class.java)
            startActivity(intent)
            finish()
        }
    }
}