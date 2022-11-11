import React, {ReactElement} from "react";

type CardProps = {
    header: ReactElement
    body: ReactElement
}

export default function Card({header, body}: CardProps ) {
    return (
        // @todo handle background color and text color - theme
        <div className="divide-y divide-gray-200 rounded-lg bg-white shadow bg-gray-800 text-white">
            <div className="px-4 py-5 sm:px-6">
                {header}
                {/* We use less vertical padding on card headers on desktop than on body sections */}
            </div>
            <div className="px-4 py-5 sm:p-6">{body}</div>
        </div>
    )
}