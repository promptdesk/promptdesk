import { User } from '@/interfaces/user';
import { userStore } from '@/stores/UserStore'
import React, { useEffect, useState } from 'react'
import UserRow from './UserRow';


const UsersTable = () => {
    const { users, fetchUsers } = userStore();
    const [usersList, setUsersList] = useState<User[]>([])


    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    useEffect(() => {
        // This will be called whenever `variables` changes
        setUsersList(users)
    }, [users]);

    return (
        <table className="min-w-full divide-y divide-gray-300">
            <thead>
                <tr>
                    <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        style={{ width: "200px" }}
                    >
                        Email
                    </th>
                    <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-left"
                        style={{ width: "100px" }}
                    >
                        Action
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {users.length && users.map(user => (
                    <UserRow key={user.email} user={user} />
                ))}
            </tbody>
        </table>
    )
}

export default UsersTable