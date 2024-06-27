export function joinLeaderboard(email, name) {
    fetch('join', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            name: name
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
}

export async function getLeaderboard() {
    const response = await fetch('leaderboard', {
        method: 'POST'
    })
    return (await response.json())
}

export async function registerUser(email, password, token) {
    const response = await fetch("new-member", {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password,
            id: token
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })

    return response
}