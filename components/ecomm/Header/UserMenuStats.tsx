import React from 'react';

type UserStats = {
    totalOrders: number;
    totalSpent: number;
    loyaltyPoints: number;
    memberSince: string;
};

const UserMenuStats: React.FC<{ userStats: UserStats }> = ({ userStats }) => {
    return (
        <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="p-3 bg-blue-500/10 rounded-lg">
                <div className="text-xs text-muted-foreground">الطلبات</div>
                <div className="text-lg font-bold text-foreground">{userStats.totalOrders}</div>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg">
                <div className="text-xs text-muted-foreground">النقاط</div>
                <div className="text-lg font-bold text-foreground">{userStats.loyaltyPoints}</div>
            </div>
        </div>
    );
};

export default UserMenuStats; 