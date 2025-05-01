package com.example.swiftthrift

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.example.swiftthrift.app.MyApplication

class RegisterStep4 : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_step4)
        val continueButton:Button=findViewById(R.id.button_continue)
        val email: EditText =findViewById(R.id.editText_Email)
        continueButton.setOnClickListener{
            if(email.text.toString().isNullOrEmpty()){
                Toast.makeText(this,"Fill out all the fields.", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }
            (application as MyApplication).email = email.text.toString()
            val intent = Intent(this,RegisterStep5::class.java)
            startActivity(intent)
        }
    }
}