package com.example.swiftthrift

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.example.swiftthrift.app.MyApplication
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody

class RegisterStep6WithAPI : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_step6_with_api)
        val continueButton:Button=findViewById(R.id.button_continue)
        val password: EditText =findViewById(R.id.editText_Password)
        continueButton.setOnClickListener{
            if(password.text.toString().isNullOrEmpty()){
                Toast.makeText(this,"Fill out all the fields.", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }
            (application as MyApplication).password = password.text.toString()
            createAccount(
                this,
                (application as MyApplication).username,
                (application as MyApplication).password,
                (application as MyApplication).name
            )

        }
    }
    private fun createAccount(context:RegisterStep6WithAPI, username: String, password: String, name: String){
        CoroutineScope(Dispatchers.IO).launch {
            val client = OkHttpClient()
            val mediaType= "application/json".toMediaType()
            val body=RequestBody.create(
                mediaType,
                """
                    "name": "$name"
                    "username": "$username",
                    "password": "$password",
                    "
                """.trimIndent()
            )
            val request = Request.Builder()
                .url("http://192.168.254.138:8080/api/users/create")
                .post(body)
                .addHeader("Content-Type", "application/json")
                .build()
            try {
                val response=client.newCall(request).execute()
                if(response.isSuccessful){
                    val responseBody=response.body?.string()
                    withContext(Dispatchers.Main){
                        Log.e("Tutorial -->","$responseBody")
                    }
                    startActivity(Intent(context,LoginActivity::class.java))
                }
                else{
                    withContext(Dispatchers.Main){
                        Log.e("Tutorial -->","${response.code}: ${response.message}")
                        Toast.makeText(context,"Saving profile failed!",Toast.LENGTH_LONG).show()
                    }
                }
            }catch (e: Exception){
                withContext(Dispatchers.Main){
                    Log.e("Tutorial -->","Error: ${e.message}")
                    Toast.makeText(context,"Unable to complete the action!",Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}