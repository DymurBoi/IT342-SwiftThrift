package com.example.swiftthrift

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.example.swiftthrift.app.MyApplication

class RegisterStep3 : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_step3)
        val continueButton:Button=findViewById(R.id.button_continue)
        val phoneNum:EditText=findViewById(R.id.editText_PhoneNum)
        continueButton.setOnClickListener{
            if(phoneNum.text.toString().isNullOrEmpty()){
                Toast.makeText(this,"Fill out all the fields.", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }
            (application as MyApplication).phoneNum = phoneNum.text.toString()
            val intent = Intent(this,RegisterStep4::class.java)
            startActivity(intent)
        }
    }
}