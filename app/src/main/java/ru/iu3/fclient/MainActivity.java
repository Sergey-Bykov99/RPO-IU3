package ru.iu3.fclient;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;
import org.apache.commons.io.IOUtils;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import javax.net.ssl.HttpsURLConnection;

public class MainActivity extends AppCompatActivity {

    // Used to load the 'native-lib' library on application startup.
    static {
        System.loadLibrary("native-lib");
        System.loadLibrary("mbedcrypto");
        initRng();
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Example of a call to a native method
        //TextView tv = findViewById(R.id.sample_text);
        //tv.setText(stringFromJNI());

        byte[] key = randomBytes(16);
        byte[] data = {'H', 'e', 'l', 'l', 'o',};
        byte[] encrypted = encrypt(key, data);
        byte[] decrypted = decrypt(key, encrypted);
        String originalData = new String(data, StandardCharsets.UTF_8);
        String encryptedData = new String(encrypted, StandardCharsets.UTF_8);
        String decryptedData = new String(decrypted, StandardCharsets.UTF_8);

        System.out.println(originalData);
        System.out.println(encryptedData);
        System.out.println(decryptedData);

        String output = new String(
                "Original: " + originalData + "\n" +
                        "Encrypted: " + encryptedData + "\n" +
                        "Decrypted: " + decryptedData + "\0"
        );

        System.out.println("Original: " + originalData);
        System.out.println("Encrypted: " + encryptedData);
        System.out.println("Decrypted: " + decryptedData);
        //tv.setText(output);
    }

    public static byte[] StringToHex(String s) {
        byte[] hex;
        try {
            hex = Hex.decodeHex(s.toCharArray());
        } catch (DecoderException ex) {
            hex = null;
        }
        return hex;
    }

    public void onButtonClick(View v) {
        //Toast.makeText(this, stringFromJNI(), Toast.LENGTH_SHORT).show();
        //Intent it = new Intent(this, PinpadActivity.class);
        //startActivityForResult(it, 0);
        Log.e("BTN_log", "Pressed");
        TestHttpClient();

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

    // HTTP TEST
    protected void TestHttpClient() {
        new Thread(() -> {
            try {
                HttpURLConnection uc = (HttpURLConnection) (new URL("http://10.0.2.2:8081/api/v1/title").openConnection());
                InputStream inputStream = uc.getInputStream();
                String html = IOUtils.toString(inputStream);
                String title = getPageTitle(html);
                runOnUiThread(() ->
                {
                    Toast.makeText(this, title, Toast.LENGTH_SHORT).show();
                    Log.e("Title_output", title);
                });
            } catch (Exception ex) {
                Log.e("fapptag", "Https client fails", ex);
            }
        }).start();
    }

    private String getPageTitle(String html) {
        int pos = html.indexOf("<title");
        String p = "not found";
        if (pos >= 0) {
            int pos2 = html.indexOf("<", pos + 1);
            if (pos >= 0) {
                p = html.substring(pos + 7, pos2);
            }
        }
        return p;
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
}