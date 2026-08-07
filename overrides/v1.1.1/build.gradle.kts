plugins {
    id("com.android.application")
}

android {
    namespace = "cl.javiersanmartin.albionmarketamerica"
    compileSdk = 35

    defaultConfig {
        applicationId = "cl.javiersanmartin.albionmarketrelli"
        minSdk = 26
        targetSdk = 35
        versionCode = 3
        versionName = "1.1.1"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.core:core:1.16.0")
    implementation("androidx.webkit:webkit:1.14.0")
    testImplementation("junit:junit:4.13.2")
}
