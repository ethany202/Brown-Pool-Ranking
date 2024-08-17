export async function joinLeaderboard(email, name) {
    const response = await fetch('join', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            name: name
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })

    return response
}

export async function getLeaderboard() {
    const response = await fetch('leaderboard', {
        method: 'POST'
    })

    return response
}

export async function registerUser(email, password, token) {
    const response = await fetch("new-member", {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password,
            token: token
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })

    return response
}