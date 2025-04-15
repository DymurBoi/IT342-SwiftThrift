package edu.cit.swiftthrift.config;

import edu.cit.swiftthrift.entity.User;
import edu.cit.swiftthrift.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collections;
import java.util.Optional;

@Configuration
@RequiredArgsConstructor
public class SecurityFilterChainConfig {

    private final UserRepository userRepository;

    //For Production if needed
   /*@Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
       http
           .cors().and()
           .csrf(csrf -> csrf.disable())
           .authorizeHttpRequests(auth -> auth
               // Public endpoints
               .requestMatchers("/api/storeRatings/**").permitAll()
               .requestMatchers("/api/users/**").permitAll()
               .requestMatchers("/api/orders/**").permitAll()
               .requestMatchers("/api/wishlist/**").permitAll()
               .requestMatchers("/api/orderItem/**").permitAll()
               .requestMatchers("/api/cart/**").permitAll()
               .requestMatchers("/api/cartItem/**").permitAll()
               .requestMatchers("/api/categories/**").permitAll()
               .requestMatchers("/api/productRatings/**").permitAll()
   
               // Allow anyone to view products
               .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
   
               // Restrict create, update, delete to ADMIN only
               .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
               .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
               .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
   
               // Only Admins can access admin endpoints
               .requestMatchers("/api/admins/**").hasRole("ADMIN")
   
               // All others require authentication
               .anyRequest().authenticated()
           )
           .oauth2Login(oauth2 -> oauth2
               .successHandler(oAuth2SuccessHandler())
           );
   
       return http.build();
   }*/

    //For Testing
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/storeRatings/**").permitAll()
                .requestMatchers("/api/users/**").permitAll()
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/api/orders/**").permitAll()
                .requestMatchers("/api/wishlist/**").permitAll()
                .requestMatchers("/api/admins/**").permitAll() 
                .requestMatchers("/api/orderItem/**").permitAll() 
                .requestMatchers("/api/cart/**").permitAll() 
                .requestMatchers("/api/cartItem/**").permitAll() 
                .requestMatchers("/api/categories/**").permitAll() 
                .requestMatchers("/api/productRatings/**").permitAll() 

                .anyRequest().permitAll()
            );
            return http.build();
    }

    // Allow frontend (React/Kotlin mobile) to access APIs
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Collections.singletonList("*")); // Allow all origins (change to specific domains if needed)
        config.setAllowedMethods(Collections.singletonList("*")); // GET, POST, PUT, DELETE, etc.
        config.setAllowedHeaders(Collections.singletonList("*"));
        config.setAllowCredentials(true); // Allow credentials (cookies, headers)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // Automatically create a new user when logging in with Google
    public AuthenticationSuccessHandler oAuth2SuccessHandler() {
        return (request, response, authentication) -> {
            String email = authentication.getName();

            Optional<User> existingUser = userRepository.findByEmail(email);

            if (existingUser.isEmpty()) {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setUsername(email.split("@")[0]); // Basic username from email
                newUser.setRole("ROLE_USER"); // Default role
                userRepository.save(newUser);
            }

            response.sendRedirect("/"); // Redirect to frontend
        };
    }

    // Needed for manual auth if you ever use login form
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}

