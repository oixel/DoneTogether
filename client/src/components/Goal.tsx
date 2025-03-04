import { useEffect, useState } from 'react';

import axios from 'axios';

import '../styles/Goal.css';

import User from './User';

interface GoalPropTypes {
    id: string;
    name: string;
    description: string;
    setUpdated: CallableFunction;
    users: Array<string>;
}

function Goal({ id, name, description, setUpdated, users }: GoalPropTypes) {
    const [searchedUser, setSearchedUser] = useState(undefined);
    const [usersData, setUsersData] = useState([]);

    // Send a DELETE request to server based on this goal's ObjectId in MongoDB
    async function deleteGoal(): Promise<void> {
        await axios.delete(`http://localhost:3001/goal/${id}`);
        setUpdated(true);
    }

    // 
    async function getUserById(id: string) {
        const result = await axios.get(`http://localhost:3001/userById/${id}`);
        return result.data.user;
    }

    async function getUsers(): Promise<void> {
        let newUsers = [];

        for (const userId of users) {
            const newUser = await getUserById(userId);
            newUsers.push(newUser);
        }

        setUsersData(newUsers);
    }

    // 
    useEffect(() => {
        getUsers();
    }, []);


    // 
    async function checkIfUserExists(username: string): Promise<void> {
        if (username) {
            const result = await axios.get(`http://localhost:3001/userByName/${username}`);

            setSearchedUser(result.data.user);
        }
        else setSearchedUser(undefined);
    }

    // 
    async function addUser(): Promise<void> {
        if (searchedUser) {
            console.log(`Add user with username ${searchedUser.username}.`);
        }
    }

    return (
        <div className="goalContainer">
            <div className="goalInfo">
                <div style={{ flexGrow: 1 }}>
                    <h1>{name || "This is the name of the goal."}</h1>
                    <p>{description || "This is the description."}</p>
                </div>
                <button className="goalButton" onClick={() => deleteGoal()}>🗑️</button>
            </div>
            <div className="usersSection">
                {usersData.map(currentUser =>
                    <User
                        key={currentUser.id}
                        imageUrl={currentUser.imageUrl}
                        username={currentUser.username}
                    />
                )

                }
                <div className="addUser">
                    <p>{(searchedUser) ? '✅' : '❌'}</p>
                    <input type="text" onChange={(e) => checkIfUserExists(e.target.value)}></input>
                    <button onClick={() => addUser()}>Add User +</button>
                </div>
            </div>
        </div >
    );
}

export default Goal;