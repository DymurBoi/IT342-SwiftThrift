package com.example.swiftthrift

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.swiftthrift.app.MyApplication

class RegisterStep2 : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_step2)
        val continueButton: Button =findViewById(R.id.button_continue)
        val birthday:EditText=findViewById(R.id.editText_Bday)
        continueButton.setOnClickListener{
            if(birthday.text.toString().isNullOrEmpty()){
                Toast.makeText(this,"Fill out all the fields.", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }
            (application as MyApplication).birthday = birthday.text.toString()
            startActivity(
                Intent(this,RegisterStep3::class.java)
            )
        }
    }
}