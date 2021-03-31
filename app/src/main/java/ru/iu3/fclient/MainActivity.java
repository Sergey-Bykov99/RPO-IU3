package ru.iu3.fclient;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;

import java.nio.charset.StandardCharsets;

public class MainActivity extends AppCompatActivity {

    // Used to load the 'native-lib' library on application startup.
    static {
        System.loadLibrary("native-lib");
        System.loadLibrary("mbedcrypto");
        initRng();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Example of a call to a native method
        // TextView tv = findViewById(R.id.sample_text);
        // tv.setText(stringFromJNI());

        byte[] key = randomBytes(16);
        byte[] data = {'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'};
        byte[] encrypted = encrypt(key, data);
        byte[] decrypted = decrypt(key, encrypted);
        String originalData  = new String(data, StandardCharsets.UTF_8);
        String encryptedData = new String(encrypted, StandardCharsets.UTF_8);
        String decryptedData = new String(decrypted, StandardCharsets.UTF_8);

        System.out.println(originalData);
        System.out.println(encryptedData);
        System.out.println(decryptedData);

        String output = new String(
                "Original: "  + originalData  + "\n" +
                        "Encrypted: " + encryptedData + "\n" +
                        "Decrypted: " + decryptedData + "\0"
        );

        System.out.println("Original: "  + originalData);
        System.out.println("Encrypted: " + encryptedData);
        System.out.println("Decrypted: " + decryptedData);
    }

    /**
     * A native method that is implemented by the 'native-lib' native library,
     * which is packaged with this application.
     */
    public native String stringFromJNI();
    public static native int initRng();
    public static native byte[] randomBytes(int n);

    public static native byte[] encrypt(byte[] key, byte[] data);
    public static native byte[] decrypt(byte[] key, byte[] data);
    public static byte[] StringToHex(String s)
    {
        byte[]hex;
        try
        {
            hex = Hex.decodeHex(s.toCharArray());
        }
        catch (DecoderException ex)
        {
            hex = null;
        }
        return hex;
    }
    public void onButtonClick(View v)
    {
        byte [] key = StringToHex("0123456789ABCDEF0123456789ABCDE0");
        byte [] enc = encrypt(key,StringToHex("000000000000000102"));
        byte [] dec = decrypt(key,enc);
        String s = new String (Hex.encodeHex(dec)).toUpperCase();
        Intent it = new Intent(this, PinpadActivity.class);
        startActivityForResult(it, 0);

    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 0) {
            if (resultCode == RESULT_OK || data != null) {
                String pin = data.getStringExtra("pin");
                Toast.makeText(this, pin, Toast.LENGTH_SHORT).show();
            }
        }
    }
}