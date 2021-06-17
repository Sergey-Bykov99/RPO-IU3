package rpo.backend.auth;

import org.apache.tomcat.jni.Local;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.www.NonceExpiredException;
import org.springframework.stereotype.Component;
import rpo.backend.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Qualifier
@Component
public class AuthenticationProvider extends AbstractUserDetailsAuthenticationProvider {

    @Value("${private.session-timeout}")
    private int sessionTimeout;

    @Autowired
    UserRepository userRepository;

    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails,
                                                  UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken) throws AuthenticationException {

    }

    @Override
    protected UserDetails retrieveUser(String userName, UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken) throws AuthenticationException {
        Object token = usernamePasswordAuthenticationToken.getCredentials();
        Optional<rpo.backend.models.User> uu = userRepository.findByToken(String.valueOf(token));
        if (uu.isEmpty())
            throw new UsernameNotFoundException("user is not found");
        rpo.backend.models.User u = uu.get();

        boolean timeout = true;
        LocalDateTime dt = LocalDateTime.now();
        if (u.activity != null) {
            LocalDateTime nt = u.activity.plusMinutes(sessionTimeout);
            if (dt.isBefore(nt))
                timeout = false;
        }
        if (timeout) {
            u.token = null;
            userRepository.save(u);
            throw new NonceExpiredException("session is expired");
        }
        else {
            u.activity = dt;
            userRepository.save(u);
        }

        return new User(u.login, u.password,
                true,
                true,
                true,
                true,
                AuthorityUtils.createAuthorityList("USER"));
    }
}