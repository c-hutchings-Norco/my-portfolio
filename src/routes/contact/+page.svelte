<body>
    <main>
        <h1>Contact me</h1>
        <form action="mailto:chutchings@ucsd.edu" method="POST" enctype="text/plain">
            <label>
                Your Email:
                <input type="email" name="email" required>
            </label>
            <br><br>
            <label>
                Subject:
                <input name="subject" required>
            </label>
            <br><br>
            <label>
                Message:
                <textarea name="body" rows="5" required></textarea>
            </label>
            <br><br>
            <button>Send</button>
        </form>
    </main>
    <script src="/global.js" type="module"></script>
</body>