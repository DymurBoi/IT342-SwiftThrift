package com.example.swiftthrift

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView

class StartingPage : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_starting_page)
        val textViewLogin:TextView = findViewById(R.id.textView_login)
        val continueWithEmailButton:Button = findViewById(R.id.button_continue)
        textViewLogin.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }
        continueWithEmailButton.setOnClickListener{
            startActivity(Intent(this,RegisterStep1::class.java))
        }
    }
}