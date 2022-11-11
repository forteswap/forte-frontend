import React, { ReactElement } from 'react';

type ContainerProps = {
    children: ReactElement
}

export default function Container({children}: ContainerProps) {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
            <div className="mx-auto max-w-3xl">{children}</div>
        </div>
    )
}