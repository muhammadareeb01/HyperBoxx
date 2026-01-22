import './freebox.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';
import freebox from '../../assestes/freebox/freecase.png'
import freeboxbtn from '../../assestes/freebox/freecase-btn.png'
import * as React from 'react';
// import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import modalbox from '../../assestes/freebox/modalbox.png'
// import referalpeople from '../../assestes/freebox/referral-people.png'
// import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
function FreeBox() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        AOS.init({
            once: true, // Animation will occur only once
        });
    }, []);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 500,
        backgroundImage: `url(${modalbox})`,
        backgroundSize: 'cover', // This will cover the entire modal with the image
        backgroundPosition: 'center',
        border: '2px solid #000',
        boxShadow: 24,
        borderRadius: 3,
        p: 4,
    };

    return (
        <>
            <div className="free_box_main">

                <div className="sub_free_box">
                    <div className="first_free_box">
                        <div className="left_box" >
                            <img src={freebox} alt="freebox" className='freeboximg' />
                            <h2 className='freebox_head'>
                                Welcome Box
                            </h2>
                            <p className='freebox_para '>
                                Register an account and receive 3 free boxes. Earn more cases by inviting friends...
                            </p>

                            <div class="input-container">
                                <input type="text" className='input-promo' placeholder="Enter a Promo Code to recieve a Free Box" />
                                <button class="promobtn">Promo Code </button>

                            </div>
                            <p className='btn_para'>
                                <button className='free_btn' onClick={handleOpen}>

                                    <img src={freeboxbtn} height={36 + 'px'} width={36 + 'px'} alt="" />

                                    <span class="now">Now!</span>
                                    <span class="play">Claim</span>
                                </button>
                            </p>

                            <Modal
                                aria-labelledby="transition-modal-title"
                                aria-describedby="transition-modal-description"
                                open={open}
                                onClose={handleClose}
                                closeAfterTransition
                            >
                                <Fade in={open}>
                                    <Box sx={modalStyle}>
                                        <Typography id="transition-modal-title" variant="h6" component="h2">
                                            Congrats! You got yourself a Free Box!
                                        </Typography>

                                        <Button onClick={handleClose} className='closebtn'>Close</Button>
                                    </Box>
                                </Fade>
                            </Modal>


                        </div>
                        {/* <div className="right_text" data-aos="fade-left" data-aos-duration="1800" >
                            <h2 className='freebox_head'>
                                Welcome Box
                            </h2>
                            <p className='freebox_para '>
                                Register an account and receive 3 free boxes. Earn more cases by inviting friends...
                            </p>
                            <p className='btn_para'>
                                <button className='free_btn'>

                                    <img src={freebox} height={36 + 'px'} width={36 + 'px'} alt="" />

                                    <span class="now">Box!</span>
                                    <span class="play">Open</span>
                                </button>
                            </p>
                        </div> */}
                    </div>
                    {/* <div className="border_bottom">
                    </div> */}

                    {/* <div className="second_free_box">

                        <div className="right_text_second left_box_second" data-aos="fade-right" data-aos-duration="1200" >
                            <h2 className='freebox_head'>
                                How it works
                            </h2>
                            <p className='freebox_para '>
                                <ul>
                                    <li>
                                        <span className='icon_'><Inventory2OutlinedIcon /></span>    Get your referral link/code and invite players to sign up.
                                    </li>
                                    <li>
                                        <span className='icon_'><Inventory2OutlinedIcon /></span>   As soon as new user claims your code, both of you will receive a free Welcome Box.
                                    </li> <li>

                                        <span className='icon_'><Inventory2OutlinedIcon /></span>   You will receive a percentage of each deposit your referral makes on the website.
                                    </li>
                                    <li>

                                        <span className='icon_'><Inventory2OutlinedIcon /></span>   Track your earnings and cash out whenever you wish.

                                    </li>
                                </ul></p>

                        </div>
                        <div className="left_box_second" data-aos="fade-left" data-aos-duration="1200">
                            <img src={referalpeople} alt="referal" width={50 + "%"} />
                        </div>
                    </div> */}

                </div>
            </div>
        </>
    )
}
export default FreeBox