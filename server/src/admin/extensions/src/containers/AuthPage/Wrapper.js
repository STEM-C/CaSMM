import styled from 'styled-components';
import Background from '../../assets/images/background_empty.svg';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  text-align: center;
  padding: 6.2rem 0;
  background: #fafafb;
  height: 100vh;
  -webkit-font-smoothing: antialiased;

  .wrapper {
    height: 22.1rem;
    width: 685px;
    text-align: center;
    background-image: url(${Background});
    background-position-x: center;
    font-size: 1.4rem;
    font-family: Lato;
  }
  .errorsContainer {
    margin-top: -21px;
    margin-bottom: 18px;
    color: #ff203c;
  }
  .headerContainer {
    > span {
      line-height: 36px;
      font-size: 24px;
      font-weight: 600;
    }
    > img {
      margin-top: 1px;
      height: 100px;
    }
  }
  .headerDescription {
    width: 41.6rem;
    text-align: center;
    margin: auto;
    padding: ${({ authType }) =>
      authType === 'register' ? '13px 30px 17px 30px' : '8px 30px 0 30px'};

    line-height: 18px;
    color: #333740;
  }

  .formContainer {
    min-height: 20rem;
    width: 41.6rem;
    margin: 1.4rem auto;
    margin-bottom: 0;
    padding: 3.9rem 1.5rem 1.5rem 1.5rem;
    border-radius: 2px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px 0 #e3e9f3;
  }

  .form-check-label {
    input[type='checkbox'] + p {
      line-height: 1.8rem;
      margin-bottom: 0;
    }
  }

  .loginButton {
    margin-top: -6px;
    margin-bottom: 31px;
    padding-right: 0;
    text-align: right;

    > button {
      margin-right: 1.6rem;
      min-width: 14rem;
    }
  }

  .buttonContainer {
    padding-top: 1.1rem;
  }

  .linkContainer {
    padding-top: 1.8rem;
    > a {
      color: #262931;
      font-size: 13px;
      &:hover,
      &:active,
      &:focus {
        text-decoration: none;
        outline: 0;
      }
    }
  }

  .bordered {
    border-top: 2px solid ${({ withSuccessBorder }) => (withSuccessBorder ? '#5a9e06' : '#1c5de7')};
  }

  .borderedSuccess {
    border-top: 2px solid #5a9e06;
  }

  .logoContainer {
    position: absolute;
    left: 30px;
    bottom: 30px;

    > img {
      height: 34px;
    }
  }

  .buttonForgotSuccess {
    border: 1px solid #5a9e06;
    color: #5a9e06;
  }

  .forgotSuccess {
    width: 100%;
    text-align: center;
    color: #5a9e06;
    font-size: 13px;
    font-weight: 500;
    > p {
      margin-top: 17px;
      margin-bottom: 18px;
      color: #333740;
    }
  }
`;

export default Wrapper;
