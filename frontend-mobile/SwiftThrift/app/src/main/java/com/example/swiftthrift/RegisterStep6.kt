package com.example.swiftthrift

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.example.swiftthrift.app.MyApplication

class RegisterStep6 : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_step6)
        val continueButton: Button =findViewById(R.id.button_continue)
        val password: EditText =findViewById(R.id.editText_Password)
        continueButton.setOnClickListener {
            if (password.text.toString().isNullOrEmpty()) {
                Toast.makeText(this, "Fill out all the fields.", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }
            (application as MyApplication).password = password.text.toString()
            startActivity(Intent(this,LoginActivity::class.java))
        }
    }
}