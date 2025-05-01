package com.example.swiftthrift.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.swiftthrift.R

class ProfileFragment : Fragment() {

    private lateinit var editProfileButton: LinearLayout
    private lateinit var orderHistoryButton: LinearLayout
    private lateinit var settingsButton: LinearLayout
    private lateinit var logoutButton: Button

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_profile, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // Initialize views
        editProfileButton = view.findViewById(R.id.edit_profile_button)
        orderHistoryButton = view.findViewById(R.id.order_history_button)
        settingsButton = view.findViewById(R.id.settings_button)
        logoutButton = view.findViewById(R.id.logout_button)

        // Set up click listeners
        editProfileButton.setOnClickListener {
            Toast.makeText(context, "Edit Profile clicked", Toast.LENGTH_SHORT).show()
            // Implement edit profile functionality
        }

        orderHistoryButton.setOnClickListener {
            Toast.makeText(context, "Order History clicked", Toast.LENGTH_SHORT).show()
            // Implement order history functionality
        }

        settingsButton.setOnClickListener {
            Toast.makeText(context, "Settings clicked", Toast.LENGTH_SHORT).show()
            // Implement settings functionality
        }

        logoutButton.setOnClickListener {
            Toast.makeText(context, "Logout clicked", Toast.LENGTH_SHORT).show()
            // Implement logout functionality
        }
    }
}

