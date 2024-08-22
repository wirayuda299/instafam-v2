
async function createUser() {
    try {
        for (let i = 0; i <= 100; i++) {
            console.log("Create user -> ", i)
            await fetch("http://localhost:3001/api/v1/users/create", {
                headers: {
                    "Content-type": "application/json"
                },
                method:"POST",
                body: JSON.stringify({
                    username: `Username-${i}`,
                    id: crypto.randomUUID(),
                    image: "https://dashboard.clerk.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybDBsVnhCMTFaMGI1RVl5Q3UyT3NHV1UyVnkifQ&w=1920&q=75",
                    email: `Username${i}@gmail.com`
                })
            })
            console.log("Done create user -> ", i)
        }
    } catch (e) {
        throw e
    }
}

createUser()
