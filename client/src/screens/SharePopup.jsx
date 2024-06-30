import React from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const SharePopup = ({ url, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg w-80 text-center relative z-50">
        <button
          className="bg-black text-white border-none text-lg  absolute top-0 right-0 cursor-pointer rounded-tr-md w-[20px]"
          onClick={onClose}
        >
          X
        </button>
        <h3 className="mb-4">Share your password with</h3>
        <div className="grid grid-cols-3 grid-rows-2 gap-4">
          <div className="text-center">
            <EmailShareButton url={url} subject="Password">
              <EmailIcon size={30} round={true} />
              Email
            </EmailShareButton>
          </div>

          <div className="text-center">
            <FacebookShareButton url={url} >
              <FacebookIcon size={30} round={true} />
              Facebook
            </FacebookShareButton>
          </div>

          <div className="text-center">
            <LinkedinShareButton url={url}>
              <LinkedinIcon size={30} round={true} />
              LinkedIn
            </LinkedinShareButton>
          </div>

          <div className="text-center">
            <TelegramShareButton url={url}>
              <TelegramIcon size={30} round={true} />
              Telegram
            </TelegramShareButton>
          </div>

          <div className="text-center">
            <TwitterShareButton url={url}>
              <TwitterIcon size={30} round={true} />
              Twitter
            </TwitterShareButton>
          </div>

          <div className="text-center">
            <WhatsappShareButton url={url}>
              <WhatsappIcon size={30} round={true} />
              Whatsapp
            </WhatsappShareButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;
