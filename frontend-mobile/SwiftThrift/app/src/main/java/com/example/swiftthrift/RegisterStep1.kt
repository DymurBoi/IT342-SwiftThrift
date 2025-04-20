package com.example.swiftthrift

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.example.swiftthrift.app.MyApplication

class RegisterStep1 : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_step1)
        val continueButton:Button=findViewById(R.id.button_continue)
        var fname:EditText=findViewById(R.id.editText_Fname)
        var lname:EditText=findViewById(R.id.editText_Lname)
        continueButton.setOnClickListener {
            val firstname = fname.text.toString()
            val lastname = lname.text.toString()

            if (firstname.isEmpty() || lastname.isEmpty()) {
                Toast.makeText(this, "Fill out all the fields.", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            (application as MyApplication).fname = firstname
            (application as MyApplication).lname = lastname

            startActivity(Intent(this, RegisterStep2::class.java))
        }
    }
}