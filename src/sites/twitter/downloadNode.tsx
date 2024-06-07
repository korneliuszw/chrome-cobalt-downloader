import ReactDOM from 'react-dom'
import React, { useEffect } from 'react'
import { DownloadNodeCreatorFunction } from '../common/createDownloadElement'


const DownloadComponent = ({handler}: {handler: () => void}) => {
    useEffect(() => {
        console.log('hello')
        return () => {
            console.log('byee')
        }
    }, [])
    return <div className='downloader-btn' onClick={handler}>
        hello
    </div>
}

export const createDownloadNode: DownloadNodeCreatorFunction = (_item, container, handler) => {
    console.log('creating')
    ReactDOM.createPortal(<DownloadComponent handler={handler}/>, container)
}