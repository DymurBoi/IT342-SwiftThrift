package com.example.swiftthrift

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import com.example.swiftthrift.app.MyApplication
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException

class LoginActivity : Activity() {

    private val client = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val textViewRegister: TextView = findViewById(R.id.textView_Register)
        val usernameEditText: EditText = findViewById(R.id.editText_Username)
        val passwordEditText: EditText = findViewById(R.id.editText_Password)
        val loginButton: Button = findViewById(R.id.button_login)

        // Prefill if coming back from register
        usernameEditText.setText((application as MyApplication).login_username)
        passwordEditText.setText((application as MyApplication).login_password)

        textViewRegister.setOnClickListener {
            startActivity(Intent(this, RegisterStep1::class.java))
        }

        loginButton.setOnClickListener {
            val username = usernameEditText.text.toString()
            val password = passwordEditText.text.toString()

            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please fill out all fields", Toast.LENGTH_SHORT).show()
            } else {
                loginUser(username, password)
            }
        }
    }

    private fun loginUser(username: String, password: String) {
        val url = "https://swiftthrift-457008.as.r.appspot.com/api/users/login"
        val mediaType = "application/json".toMediaType()
        val json = """
                    {
                        "email": "$username",
                        "password": "$password"
                    }
                """.trimIndent()

        val body = json.toRequestBody("application/json".toMediaType())

        val request = Request.Builder()
            .url("https://swiftthrift-457008.as.r.appspot.com/api/users/login")
            .post(body)
            .addHeader("Content-Type", "application/json")
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    Toast.makeText(this@LoginActivity, "Login failed: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                val responseBody = response.body?.string()

                if (response.isSuccessful && !responseBody.isNullOrEmpty()) {
                    try {
                        val jsonResponse = JSONObject(responseBody)
                        val token = jsonResponse.optString("token", null)

                        if (!token.isNullOrEmpty()) {
                            val app = application as MyApplication
                            app.jwtToken = token
                            app.login_username = username
                            app.login_password = password

                            runOnUiThread {
                                Toast.makeText(this@LoginActivity, "Login successful!", Toast.LENGTH_SHORT).show()
                                startActivity(Intent(this@LoginActivity, HomePage::class.java))
                                finish()
                            }
                        } else {
                            showLoginError("No token found in response")
                        }
                    } catch (e: Exception) {
                        showLoginError("Parsing error: ${e.message}")
                    }
                } else {
                    showLoginError("Invalid credentials or server error (${response.code})")
                }
            }
        })
    }

    private fun showLoginError(message: String) {
        runOnUiThread {
            Log.e("LoginError", message)
            Toast.makeText(this@LoginActivity, "Login failed: $message", Toast.LENGTH_LONG).show()
        }
    }
}
