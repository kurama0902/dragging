export const DropdownArrowSVG = ({ deg }: {deg: number}) => {
    return (
        <svg style={{transition: 'all .3s', transform: `rotate(${deg}deg)`}} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 4.45L4 8.95L5.05 10L8.5 6.55L11.95 10L13 8.95L8.5 4.45Z" fill="white" />
        </svg>
    )
}