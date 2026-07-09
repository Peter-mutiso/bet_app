"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Notification } from "../types/notification";

interface NotificationStore {

    notifications: Notification[];

    unread: number;

    addNotification(
        notification: Omit<
            Notification,
            "id" | "createdAt" | "updatedAt"
        >
    ): void;

    markRead(id: string): void;

    markAllRead(): void;

    clear(): void;
}

const now = () => new Date().toISOString();

export const useNotificationStore =
create<NotificationStore>()(

persist(

(set)=>({

notifications:[],

unread:0,

addNotification(notification){

const item:Notification={

...notification,

id:crypto.randomUUID(),

createdAt:now(),

updatedAt:now()

};

set(state=>({

notifications:[item,...state.notifications],

unread:state.unread+1

}));

},

markRead(id){

set(state=>({

notifications:state.notifications.map(n=>

n.id===id

?{

...n,

read:true,

updatedAt:now()

}

:n

),

unread:Math.max(

0,

state.unread-1

)

}));

},

markAllRead(){

set(state=>({

notifications:state.notifications.map(n=>({

...n,

read:true

})),

unread:0

}));

},

clear(){

set({

notifications:[],

unread:0

});

}

}),

{

name:"notifications"

}

)

);