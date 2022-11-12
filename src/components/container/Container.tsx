import React, { ReactElement } from 'react';

type ContainerProps = {
    children: ReactElement
}

const Container = ({children}: ContainerProps) => {
    return (
        <div className="tw-h-full tw-flex tw-place-items-center tw-mx-auto tw-w-full tw-px-4 tw-sm:px-6 tw-lg:px-8">
            <div className="tw-mx-auto tw-w-full">{children}</div>
        </div>
    )
}

export default Container;
