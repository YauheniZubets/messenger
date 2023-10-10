import { useState } from 'react';

import { updateUserName, updateUserPhoto, updateUserEmail, updateUserDataInFirestore } from '../firebaseUsers';
import { StorageMethods } from '../firebase';
import { useForm } from "react-hook-form";

import noUser from './img/no-user.svg';
import arrBack from '../pages/img/arr-back.svg';

import './userDataModal.css';

export const UserDataModal = (props) => {

    const [stage, setStage] = useState(1);
    const [src, setSrc] = useState(null);
    const [imageCase, toogleImageCase] = useState(true);

    const {closeModal, user} = props;

    const cbCloseModal = (ev) => {
        const targ = ev.target;
        if (targ.tagName === 'SECTION') closeModal();
    };

    const cbShowPreview = (ev) => {
        const currFiles = ev.target.files;
        console.log('currFiles: ', currFiles);
        if (currFiles.length > 0){
            const src = URL.createObjectURL(currFiles[0]);
            setSrc(src);
        }
    }

    const { register, handleSubmit, watch, formState: { errors }, onChange } = useForm({
        defaultValues: {
            userName: user.displayName,
            email: user.email
        }
    });

    const onSubmit = async data => {
        console.log('data: ', data);
        let resultImg = null;
        if (data.photo[0]) {
            resultImg = await StorageMethods.uploadImage(data.photo[0], user.displayName);
        }
        if (resultImg) updateUserPhoto(resultImg);
        if (user.email !== data.email) updateUserEmail(data.email);
        if (user.displayName !== data.userName) updateUserName(data.userName);
        if (data) updateUserDataInFirestore(user.uid, data, user.photoURL);
       
    }

    return (
        <>
            <section className='user-data-modal' onClick={cbCloseModal} />
            <div className='user-data-modal-inner'>
            {
                stage === 2 &&
                <div className='user-data-modal-back'>
                    {
                        user &&
                        <div onClick={()=>setStage(1)}>
                            <img src={arrBack} alt='arr-back' />
                            Назад
                        </div>
                    }
                </div>
            }
                <form onSubmit={handleSubmit(onSubmit)} className='user-data-form'>
                    <div className='user-data-modal-data'>
                        <div className='user-data-modal-names'>
                            <div>Имя:</div>
                            <div>E-mail:</div>
                        </div>
                        <div className='user-data-modal-prop'>
                            <div>
                                {stage === 1 && user.displayName}
                                {
                                    stage === 2 && 
                                    <input type='text' {...register('userName', {
                                        required: true
                                    })}  />
                                }
                            </div>
                            <div>
                                {stage === 1 && user.email}
                                {
                                    stage === 2 && 
                                    <input type='text' {...register('email', {
                                        required: true,
                                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i
                                    })}  />
                                }
                            </div>
                        </div>
                            <div className='user-modal-photo'>
                                <div className='image-wrapper'>
                                    <img src={imageCase ? user.photoURL : noUser} alt='photo-user' onError={()=>toogleImageCase(false)} />
                                </div>
                            </div>
                    </div>
                    <div className='modal-button'>
                        {
                            stage === 2 && 
                                <div class="container-file">
                                    <label className='label-container' for="file" id="file-upload">Выбрать фото</label>
                                    <input className='modal-file' type="file" name="file-upload" 
                                    id="file" accepts=".jpg, .jpeg, .png"  
                                    {...register('photo')} onChange={cbShowPreview}
                                    />

                                    <div className="preview">
                                        <img className={`preview-img ${src && 'preview-img-block'}`} src={src} alt='avatar' />
                                    </div>
                                </div>
                        }    
                        {
                            stage === 1 && 
                            <button className='btn-style' onClick={()=>setStage(2)}>Изменить информацию</button>
                        }
                        {
                            stage === 2 &&
                            <div>
                                <input className='btn-style' type='submit' value='Сохранить'/>
                            </div>
                        }
                    </div>
                </form>
            </div>
        </>
        
    )
}