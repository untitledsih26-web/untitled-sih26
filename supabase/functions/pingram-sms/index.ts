Deno.serve(async (req) => {
  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);
    
    const rawPhone = payload.sms?.phone || payload.user?.phone || payload.phone;
    const otpCode = payload.sms?.otp || payload.otp || payload.code;

    // Securely read from Supabase environment secrets
    const apiKey = Deno.env.get("PINGRAM_API_KEY");

    if (!apiKey) {
      throw new Error("PINGRAM_API_KEY secret is not set in Supabase!");
    }

    if (!rawPhone || !otpCode) {
      throw new Error("Missing phone or OTP fields in payload.");
    }

    // Normalize phone number into strict E.164 format (+[country code][number])
    let formattedPhone = rawPhone.trim();
    if (!formattedPhone.startsWith("+")) {
      const digitsOnly = formattedPhone.replace(/\D/g, "");
      formattedPhone = digitsOnly.length === 10 ? "+91" + digitsOnly : "+" + digitsOnly;
    }

    // Timeout controller to prevent exceeding Supabase's 5s hook limit
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const pingramResponse = await fetch("https://api.pingram.io/sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        type: "otp_delivery",
        to: formattedPhone,
        message: `Your Sarkar Seva verification code is: ${otpCode}. Reply STOP to opt-out.`
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const responseText = await pingramResponse.text();

    if (!pingramResponse.ok) {
      throw new Error(`Pingram API error (${pingramResponse.status}): ${responseText}`);
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    const isTimeout = error.name === "AbortError";
    const errorMessage = isTimeout ? "Pingram API request timed out after 3.5s" : error.message;
    
    console.error("=== EDGE FUNCTION ERROR ===", errorMessage);
    return new Response(JSON.stringify({ 
      error: {
        http_code: 500,
        message: errorMessage
      }
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
