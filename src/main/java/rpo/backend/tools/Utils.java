package rpo.backend.tools;

import org.springframework.security.crypto.codec.Hex;
import java.security.MessageDigest;

public class Utils {
    //вычисляет SHA-256
    public static String ComputeHash(String pwd, String salt)
    {
        MessageDigest digest;
        byte[] w = Hex.decode(new String(Hex.encode(pwd.getBytes())) + salt);
        try {
            digest = MessageDigest.getInstance("SHA-256");
        }
        catch (Exception ex)
        {
            return new String();
        }
        return new String(Hex.encode(digest.digest(w)));
    }
}