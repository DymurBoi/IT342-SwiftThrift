    package edu.cit.swiftthrift.security;

    import edu.cit.swiftthrift.entity.User;
    import io.jsonwebtoken.Jwts;
    import io.jsonwebtoken.SignatureAlgorithm;
    import org.springframework.stereotype.Component;

    import java.util.Date;

    @Component
    public class JwtTokenProvider {
        private final String JWT_SECRET = "your-secret-key";
        private final long JWT_EXPIRATION = 86400000L; // 24 hours

        public String generateToken(User user) {
            return Jwts.builder()
                    .setSubject(String.valueOf(user.getUserId()))
                    .claim("email", user.getEmail())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                    .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                    .compact();
        }
    }
