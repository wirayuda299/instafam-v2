
async function createUser() {
    try {
        await fetch('http://localhost:3001/api/v1/users/create', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                username: "wira233",
                email: "wirayuda233@gmail.com",
                id: "user_2l0lVsPFVGWLledC4fiJxcSi2Hc",
                image: "https://dashboard.clerk.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybDBsVnhCMTFaMGI1RVl5Q3UyT3NHV1UyVnkifQ&w=1920&q=75"
            })
        })
        console.log("Done create user")
    } catch (e) {
        console.log(e)
    }

}
async function createPost() {
    try {
        for (let i = 0; i < 100; i++) {
            console.log("Create post -> ", i)
            await fetch('http://localhost:3001/api/v1/posts/create', {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    captions: "Hello" + i,
                    media_url: "https://utfs.io/f/c014de3a-f4fb-47e0-b6ec-98c3ee32db9d-87i6xj.png",
                    media_asset_id: "c014de3a-f4fb-47e0-b6ec-98c3ee32db9d-87i6xj.png",
                    author: "user_2l0lVsPFVGWLledC4fiJxcSi2Hc",
                    published: true,
                })
            })
            console.log("Done create user -> ", i)
        }
    } catch (e) {
        console.log(e)
    }
}
createPost()
