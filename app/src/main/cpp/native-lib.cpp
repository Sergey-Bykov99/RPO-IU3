#include <jni.h>
#include <string>
#include <android/log.h>
#include <memory>

#define LOG_INFO(...) __android_log_print(ANDROID_LOG_INFO, "fclient_ndk", __VA_ARGS__)

#include </Users/sergej/AndroidStudioProjects/libs/spdlog/spdlog/include/spdlog/spdlog.h>
#include "/Users/sergej/AndroidStudioProjects/libs/spdlog/spdlog/include/spdlog/sinks/android_sink.h"

#define SLOG_INFO(...) android_logger->info( __VA_ARGS__ )
auto android_logger = spdlog::android_logger_mt( "android", "fclient_ndk");

extern "C" JNIEXPORT jstring JNICALL
Java_ru_iu3_fclient_MainActivity_stringFromJNI(
        JNIEnv* env,
        jobject /* this */) {
    std::string hello = "Hello World!";
    LOG_INFO("Hello from system log %d", 2021);
    SLOG_INFO("Hello from spdlog {}", 2021);
    return env->NewStringUTF(hello.c_str());
}

#include "/Users/sergej/AndroidStudioProjects/libs/mbedtls/mbedtls/include/mbedtls/entropy.h"
#include "/Users/sergej/AndroidStudioProjects/libs/mbedtls/mbedtls/include/mbedtls/ctr_drbg.h"
#include "/Users/sergej/AndroidStudioProjects/libs/mbedtls/mbedtls/include/mbedtls/des.h"

mbedtls_entropy_context entropy;
mbedtls_ctr_drbg_context ctrDrbgContext;
std::string personalization = "fclient-sample-app";

extern "C" JNIEXPORT jint JNICALL
Java_ru_iu3_fclient_MainActivity_initRng(
        JNIEnv *env,
        jclass clazz ) {
    mbedtls_entropy_init(&entropy);
    mbedtls_ctr_drbg_init(&ctrDrbgContext);
    return mbedtls_ctr_drbg_seed(
            &ctrDrbgContext, mbedtls_entropy_func, &entropy,
            reinterpret_cast<const unsigned char*>(personalization.c_str()),
            personalization.size()
    );
}

extern "C" JNIEXPORT jbyteArray JNICALL
Java_ru_iu3_fclient_MainActivity_randomBytes(
        JNIEnv *env,
        jclass clazz,
        jint n ) {
    std::unique_ptr<uint8_t[]> buf = std::make_unique<uint8_t[]>(n);
    mbedtls_ctr_drbg_random(&ctrDrbgContext, buf.get(), n);
    jbyteArray rnd = env->NewByteArray(n);
    env->SetByteArrayRegion(rnd, 0, n, reinterpret_cast<jbyte*>(buf.get()));
    return rnd;
}

extern "C" JNIEXPORT jbyteArray JNICALL
Java_ru_iu3_fclient_MainActivity_encrypt(
        JNIEnv *env,
        jclass clazz,
        jbyteArray key,
        jbyteArray data ) {
    jsize keySize = env->GetArrayLength(key);
    jsize dataSize = env->GetArrayLength(data);
    SLOG_INFO("Encrypt: {} {}", keySize, dataSize);
    if(keySize != 16 || dataSize <= 0) {
        return env->NewByteArray(0);
    }
    mbedtls_des3_context ctx;
    mbedtls_des3_init(&ctx);
    jbyte *pKey = env->GetByteArrayElements(key, 0);
    int rst = dataSize % 8;
    int sz = dataSize + 8 - rst;
    std::unique_ptr<uint8_t[]> buf = std::make_unique<uint8_t[]>(sz);
    for (int i = 7; i > rst; --i) {
        buf[dataSize + i] = rst;
    }
    jbyte *pData = env->GetByteArrayElements(data, 0);
    std::copy(pData, pData + dataSize, buf.get());
    mbedtls_des3_set2key_enc(&ctx, reinterpret_cast<uint8_t*>(pKey));
    int cn = sz / 8;
    for (int i = 0; i < cn; ++i) {
        mbedtls_des3_crypt_ecb(&ctx, buf.get() + i * 8, buf.get() + i * 8);
    }
    jbyteArray dout = env->NewByteArray(sz);
    env->SetByteArrayRegion(dout, 0, sz, reinterpret_cast<jbyte *>(buf.get()));
    env->ReleaseByteArrayElements(key, pKey, 0);
    env->ReleaseByteArrayElements(data, pData, 0);
    return dout;
}

extern "C" JNIEXPORT jbyteArray JNICALL
Java_ru_iu3_fclient_MainActivity_decrypt(
        JNIEnv *env,
        jclass clazz,
        jbyteArray key,
        jbyteArray data ) {
    jsize keySize = env->GetArrayLength(key);
    jsize dataSize = env->GetArrayLength(data);
    SLOG_INFO("Decrypt: {} {}", keySize, dataSize);
    if(keySize != 16 || dataSize <= 0 || (dataSize % 8) != 0) {
        return env->NewByteArray(0);
    }
    mbedtls_des3_context ctx;
    mbedtls_des3_init(&ctx);
    jbyte *pKey = env->GetByteArrayElements(key, 0);
    jbyte *pData = env->GetByteArrayElements(data, 0);
    std::unique_ptr<uint8_t[]> buf = std::make_unique<uint8_t[]>(dataSize);
    std::copy(pData, pData + dataSize, buf.get());
    mbedtls_des3_set2key_dec(&ctx, reinterpret_cast<uint8_t*>(pKey));
    int cn = dataSize / 8;
    for (int i = 0; i < cn; ++i) {
        mbedtls_des3_crypt_ecb(&ctx, buf.get() + i * 8, buf.get() + i * 8);
    }
    int sz = dataSize - 8 + buf[dataSize - 1];
    jbyteArray dout = env->NewByteArray(cn * 8);
    env->SetByteArrayRegion(dout, 0, cn * 8, reinterpret_cast<jbyte *>(buf.get()));
    env->ReleaseByteArrayElements(key, pKey, 0);
    env->ReleaseByteArrayElements(data, pData, 0);
    return dout;
}