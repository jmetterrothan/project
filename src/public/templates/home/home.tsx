import React from 'react';

import Row from '@components/row/row';
import Col from '@components/col/col';
import UIManager from '@ui/UIManager';
import CommonUtils from '@app/shared/utils/Common.utils';
import MathUtils from '@app/shared/utils/Math.utils';

import { configSvc } from '@app/shared/services/config.service';
import { translationSvc } from '@app/shared/services/translation.service';
import { storageSvc } from '@shared/services/storage.service';

import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { UIStates } from '@ui/enums/UIStates.enum';
import { GRAPHICS_QUALITY } from '@shared/enums/graphicsQuality.enum';
import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';

import './home.scss';

import previewImage from '@images/previews/world.png';
import previewImage2 from '@images/previews/world2.png';
import previewImage3 from '@images/previews/world3.png';
import previewImage4 from '@images/previews/world4.png';
import previewImage5 from '@images/previews/world5.png';

interface IHomeProps {
  uiManager: UIManager;
}

interface IHomeState {
  seedValue: string;
  selectedQuality: GRAPHICS_QUALITY;
  debugMode: boolean;
  onlineMode: boolean;
  soundMode: boolean;
  formValid: boolean;
  image: string;
}

interface IHomeParametersStorage {
  quality: GRAPHICS_QUALITY;
  debug: boolean;
  online: boolean;
  sound: boolean;
}

const imageList = [previewImage, previewImage2, previewImage3, previewImage4, previewImage5];

class Home extends React.PureComponent<IHomeProps, IHomeState> {
  form: HTMLFormElement;
  seedInput: HTMLInputElement;
  storage: IHomeParametersStorage;

  constructor(props) {
    super(props);

    this.storage = Object.assign({
      quality: GRAPHICS_QUALITY.HIGH,
      debug: configSvc.debug,
      online: false,
      sound: false
    }, storageSvc.get<IHomeParametersStorage>(STORAGES_KEY.ui) || {});

    this.state = {
      seedValue: MathUtils.randomUint32().toString(),
      selectedQuality: this.storage.quality,
      debugMode: this.storage.debug,
      onlineMode: this.storage.online,
      soundMode: this.storage.sound,
      formValid: true,
      image: imageList[Math.floor(Math.random() * imageList.length)]
    };
  }

  /**
   * Dispatch all UI changes to the storage or used services
   */
  dispatchChanges() {
    this.storage = {
      quality: this.state.selectedQuality,
      online: this.state.onlineMode,
      sound: this.state.soundMode,
      debug: this.state.debugMode
    };

    configSvc.quality = this.state.selectedQuality;
    configSvc.debug = this.state.debugMode;
    configSvc.soundEnabled = this.state.soundMode;

    storageSvc.set<IHomeParametersStorage>(STORAGES_KEY.ui, this.storage);
  }

  componentWillMount() {
    this.dispatchChanges();
  }

  componentDidUpdate() {
    this.dispatchChanges();
  }

  handleSubmit = ev => {
    ev.preventDefault();

    const { seedValue, onlineMode, soundMode } = this.state;
    const { uiManager } = this.props;

    uiManager.switchState(UIStates.LOADING, {
      seed: seedValue.length ? seedValue.trim() : undefined,
      online: onlineMode,
      sound: soundMode
    } as IUIManagerParameters);
  }

  handleChange = (e) => {
    let valid;
    if (this.seedInput.value.length) {
      this.seedInput.required = true;
      valid = this.seedInput.checkValidity();
    } else {
      this.seedInput.required = false;
      valid = true;
    }

    this.setState({
      seedValue: this.seedInput.value,
      formValid: valid
    });
  }

  handleQualityChange = ev => {
    const quality = Number(ev.target.value | 0);
    this.setState({ selectedQuality: quality });
  }

  handleDebugChange = () => {
    const debug = !configSvc.debug;
    this.setState({ debugMode: debug });
  }

  handleOnlineChange = ev => {
    const onlineMode = Number(ev.target.value) === 1;
    this.setState({ onlineMode });
  }

  handleSoundChange = ev => {
    const soundMode = Number(ev.target.value) === 1;
    this.setState({ soundMode });
  }

  render() {
    const { seedValue, formValid, selectedQuality, onlineMode, soundMode, image } = this.state;

    return (
      <section className='ui__state home p-2'>
        <header className='home__header mt-2-t mt-4-l mb-2'>
          <h2 className='home__subtitle mb-1'>{translationSvc.translate('UI.home.subtitle')}</h2>
          <h1 className='home__title'>{translationSvc.translate('UI.home.title')}</h1>
        </header>
        <div className='home__preview'>
          <img src={image} alt='world' />
        </div>
        <form id='gameSetup' className='home__form form' onSubmit={this.handleSubmit} ref={el => this.form = el}>
          <Row suffix='-48'>
            <Col className='flexcol--24 flexcol--13-t mb-2 mb-0-t'>
              <Row className='form__group mb-2'>
                <Col Tag='h4' className='flexcol--24 mb-1'>{translationSvc.translate('UI.home.form.seed')}</Col>
                <Col className='flexcol--24'>
                  <input type='text' name='seed' placeholder={translationSvc.translate('UI.home.form.seed_placeholder')} onChange={this.handleChange} value={seedValue} pattern='^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$' minLength={1} ref={el => this.seedInput = el} />
                </Col>
              </Row>
              <Row className='form__group test'>
                <Col Tag='h4' className='flexcol--24 mb-1'>{translationSvc.translate('UI.home.form.graphics')}</Col>
                <Col className='flexcol--8'>
                  <input type='radio' id='qualityLow' name='selectedQuality' onChange={this.handleQualityChange} value={GRAPHICS_QUALITY.LOW} checked={selectedQuality === GRAPHICS_QUALITY.LOW} />
                  <label htmlFor='qualityLow' className='mr-2 ui-click-sound'>{translationSvc.translate('UI.home.form.low_quality_option')}</label>
                </Col>
                <Col className='flexcol--8'>
                  <input type='radio' id='qualityMedium' name='selectedQuality' onChange={this.handleQualityChange} value={GRAPHICS_QUALITY.MEDIUM} checked={selectedQuality === GRAPHICS_QUALITY.MEDIUM} />
                  <label htmlFor='qualityMedium' className='mr-2 ui-click-sound'>{translationSvc.translate('UI.home.form.medium_quality_option')}</label>
                </Col>
                <Col className='flexcol--8'>
                  <input type='radio' id='qualityHigh' name='selectedQuality' onChange={this.handleQualityChange} value={GRAPHICS_QUALITY.HIGH} checked={selectedQuality === GRAPHICS_QUALITY.HIGH} />
                  <label htmlFor='qualityHigh' className='ui-click-sound'>{translationSvc.translate('UI.home.form.high_quality_option')}</label>
                </Col>
              </Row>
            </Col>
            <Col className='flexcol--24 flexcol--11-t'>
              <Row className='form__group mb-2'>
                <Col Tag='h4' className='flexcol--24 mb-1'>{translationSvc.translate('UI.home.form.gamemode')}</Col>
                <Col className='flexcol--12'>
                  <input type='radio' id='onlineModeOff' name='onlineMode' onChange={this.handleOnlineChange} value='0' checked={onlineMode === false} />
                  <label htmlFor='onlineModeOff' className='mr-2 ui-click-sound'>{translationSvc.translate('UI.home.form.singleplayer_option')}</label>
                </Col>
                <Col className='flexcol--12'>
                  <input type='radio' id='onlineModeOn' name='onlineMode' onChange={this.handleOnlineChange} value='1' checked={onlineMode !== false} />
                  <label htmlFor='onlineModeOn' className='ui-click-sound'>{translationSvc.translate('UI.home.form.multiplayer_option')}</label>
                </Col>
              </Row>
              <Row className='form__group'>
                <Col Tag='h4' className='flexcol--24 mb-1'>{translationSvc.translate('UI.home.form.soundmode')}</Col>
                <Col className='flexcol--12'>
                  <input type='radio' id='soundOff' name='soundMode' onChange={this.handleSoundChange} value='0' checked={soundMode === false} />
                  <label htmlFor='soundOff' className='mr-2 ui-click-sound'>{translationSvc.translate('UI.home.form.sound_off_option')}</label>
                </Col>
                <Col className='flexcol--12'>
                  <input type='radio' id='soundOn' name='soundMode' onChange={this.handleSoundChange} value='1' checked={soundMode !== false} />
                  <label htmlFor='soundOn' className='ui-click-sound'>{translationSvc.translate('UI.home.form.sound_on_option')}</label>
                </Col>
              </Row>
            </Col>
          </Row>

          {this.renderDebugHtmlFinal()}

          <footer className='home__footer mt-3 mb-2-t mb-4-l'>
            <input form='gameSetup' type='submit' value={translationSvc.translate('UI.home.form.start_btn')} className='btn btn--magenta btn--expand-mobile ui-click-sound' disabled={!formValid} />
          </footer>
        </form>
      </section>
    );
  }

  private renderDebugHtmlFinal(): JSX.Element {
    const { debugMode } = this.state;

    const debugHtml = (
      <div className='form__group mt-2'>
        <input type='checkbox' id='debugMode' onChange={this.handleDebugChange} checked={debugMode === true} />
        <label htmlFor='debugMode'>{translationSvc.translate('UI.home.debug')}</label>
      </div>
    );

    return CommonUtils.isDev() ? debugHtml : null;
  }
}

export default Home;
