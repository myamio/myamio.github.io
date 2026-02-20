from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:4321")

        # Wait for content to load
        page.wait_for_selector('text=Hatena Blog', timeout=5000)

        # Verify text
        if page.get_by_text("Hatena Blog").count() > 0:
            print("Hatena Blog text found.")
        else:
            print("Hatena Blog text NOT found.")

        # Verify link
        link = page.locator('a[href="https://myamio.hatenablog.com/"]')
        if link.count() > 0:
            print("Link found.")
        else:
            print("Link NOT found.")

        page.screenshot(path="verification/hatena_verification.png", full_page=True)
        browser.close()

if __name__ == "__main__":
    run()
