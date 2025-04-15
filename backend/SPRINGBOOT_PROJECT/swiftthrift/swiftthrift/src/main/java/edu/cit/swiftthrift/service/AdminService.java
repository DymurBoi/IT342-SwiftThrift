package edu.cit.swiftthrift.service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.swiftthrift.entity.Admin;
import edu.cit.swiftthrift.repository.AdminRepository;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    // Save or register a new admin
    public Admin saveAdmin(Admin admin) {
        admin.setRole("ADMIN");
        return adminRepository.save(admin);
    }

    // Authenticate admin by checking username and password
    public boolean authenticateAdmin(String username, String password) {
        Optional<Admin> admin = adminRepository.findByUsername(username);
        return admin.isPresent() && admin.get().getPassword().equals(password);
    }

    // Method to fetch all admins
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }
}
