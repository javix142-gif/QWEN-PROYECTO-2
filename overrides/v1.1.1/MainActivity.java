package cl.javiersanmartin.albionmarketamerica;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;

public final class MainActivity extends Activity {
    private static final String LOCAL_HOST = "appassets.androidplatform.net";
    private static final String START_URL =
            "https://" + LOCAL_HOST + "/assets/www/index.html?android=1";
    private static final String JAVASCRIPT_BRIDGE = "MarketrelliNative";

    private WebView webView;

    @Override
    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        try {
            configureEdgeToEdge();
            createWebView(savedInstanceState);
        } catch (Throwable startupError) {
            showStartupFallback(startupError);
        }
    }

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    private void createWebView(@Nullable Bundle savedInstanceState) {
        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(17, 24, 39));
        setContentView(webView);
        applyWindowInsets(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setUserAgentString(
                settings.getUserAgentString() + " AlbionMarketrelli/1.1.1"
        );
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(true);
        }

        webView.addJavascriptInterface(new NativeUiBridge(), JAVASCRIPT_BRIDGE);

        WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler(
                        "/assets/",
                        new WebViewAssetLoader.AssetsPathHandler(this)
                )
                .build();

        webView.setWebViewClient(new LocalContentClient(assetLoader));
        webView.setWebChromeClient(new WebChromeClient());

        if (savedInstanceState == null || webView.restoreState(savedInstanceState) == null) {
            webView.loadUrl(START_URL);
        }
    }

    private void configureEdgeToEdge() {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        getWindow().setNavigationBarColor(Color.TRANSPARENT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            getWindow().setNavigationBarContrastEnforced(false);
        }

        boolean systemIsLight = (getResources().getConfiguration().uiMode
                & Configuration.UI_MODE_NIGHT_MASK) != Configuration.UI_MODE_NIGHT_YES;
        setLightSystemBars(systemIsLight);
    }

    private void applyWindowInsets(@NonNull WebView view) {
        ViewCompat.setOnApplyWindowInsetsListener(view, (target, windowInsets) -> {
            Insets bars = windowInsets.getInsets(
                    WindowInsetsCompat.Type.systemBars()
                            | WindowInsetsCompat.Type.displayCutout()
            );
            Insets ime = windowInsets.getInsets(WindowInsetsCompat.Type.ime());

            InsetsPolicy.Result resolved = InsetsPolicy.resolve(
                    bars.left,
                    bars.top,
                    bars.right,
                    bars.bottom,
                    ime.bottom
            );
            target.setPadding(resolved.left, resolved.top, resolved.right, resolved.bottom);
            return windowInsets;
        });
        ViewCompat.requestApplyInsets(view);
    }

    private void setLightSystemBars(boolean light) {
        WindowInsetsControllerCompat controller =
                WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controller.setAppearanceLightStatusBars(light);
        controller.setAppearanceLightNavigationBars(light);
    }

    private void showStartupFallback(@NonNull Throwable error) {
        if (webView != null) {
            try {
                webView.destroy();
            } catch (Throwable ignored) {
                // Fallback defensivo: no dejar que una segunda excepción cierre la actividad.
            }
            webView = null;
        }

        TextView message = new TextView(this);
        message.setTextColor(Color.WHITE);
        message.setBackgroundColor(Color.rgb(17, 24, 39));
        message.setTextSize(16f);
        int padding = Math.round(24 * getResources().getDisplayMetrics().density);
        message.setPadding(padding, padding, padding, padding);
        message.setText(
                "Albion Marketrelli no pudo iniciar el visor web.\n\n"
                        + error.getClass().getSimpleName()
                        + (error.getMessage() == null ? "" : ": " + error.getMessage())
                        + "\n\nRevisa que Android System WebView/Chrome esté habilitado y actualizado."
        );
        setContentView(message);
    }

    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        if (webView != null) {
            webView.saveState(outState);
        }
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.removeJavascriptInterface(JAVASCRIPT_BRIDGE);
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    public final class NativeUiBridge {
        @JavascriptInterface
        public void setTheme(String theme) {
            boolean light = "light".equalsIgnoreCase(theme);
            runOnUiThread(() -> setLightSystemBars(light));
        }
    }

    private final class LocalContentClient extends WebViewClientCompat {
        private final WebViewAssetLoader assetLoader;

        private LocalContentClient(WebViewAssetLoader assetLoader) {
            this.assetLoader = assetLoader;
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(
                @NonNull WebView view,
                @NonNull WebResourceRequest request
        ) {
            return assetLoader.shouldInterceptRequest(request.getUrl());
        }

        @Override
        @SuppressWarnings("deprecation")
        public WebResourceResponse shouldInterceptRequest(
                @NonNull WebView view,
                @NonNull String url
        ) {
            return assetLoader.shouldInterceptRequest(Uri.parse(url));
        }

        @Override
        public boolean shouldOverrideUrlLoading(
                @NonNull WebView view,
                @NonNull WebResourceRequest request
        ) {
            return handleNavigation(request.getUrl());
        }

        @Override
        @SuppressWarnings("deprecation")
        public boolean shouldOverrideUrlLoading(
                @NonNull WebView view,
                @NonNull String url
        ) {
            return handleNavigation(Uri.parse(url));
        }

        private boolean handleNavigation(Uri uri) {
            if (LOCAL_HOST.equalsIgnoreCase(uri.getHost())) return false;
            String scheme = uri.getScheme();
            if (!"https".equalsIgnoreCase(scheme) && !"http".equalsIgnoreCase(scheme)) {
                return true;
            }
            try {
                startActivity(new Intent(Intent.ACTION_VIEW, uri));
            } catch (ActivityNotFoundException ignored) {
                // No existe una aplicación capaz de abrir el enlace externo.
            }
            return true;
        }
    }
}
