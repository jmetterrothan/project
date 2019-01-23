import React from 'react';
import classNames from 'classnames';

import './credits.styles';

enum Icons {
  Portfolio = 'sphere',
  Github = 'github',
  LinkedIn = 'linkedin',
  StackOverflow = 'stackoverflow',
  Email = 'envelop',
  Twitter = 'twitter'
}

const collaborators: ICollaboratorProps[] = [
  {
    fullname: 'Jérémie Metter-Rothan',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer varius sed neque vulputate luctus.',
    links: [
      { url: 'https://jeremie.metter-rothan.fr', icon: Icons.Portfolio },
      { url: 'https://github.com/jmetterrothan', icon: Icons.Github },
      { url: 'https://www.linkedin.com/in/jeremie-metter-rothan', icon: Icons.LinkedIn }
    ]
  },
  {
    fullname: 'Florian Zobèle',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer varius sed neque vulputate luctus.',
    links: [
      { url: 'https://florianzobele.fr', icon: Icons.Portfolio },
      { url: 'https://github.com/Ghuntheur', icon: Icons.Github },
      { url: 'https://www.linkedin.com/in/florianzobele', icon: Icons.LinkedIn },
      { url: 'https://stackoverflow.com/users/9239242/ghuntheur', icon: Icons.StackOverflow },
      { url: 'mailto:hello@florianzobele.fr', icon: Icons.Email }
    ]
  },
  {
    fullname: 'Lucas Dussouchaud',
    description: 'Commandes vocales avec tensorflow',
    links: [
      { url: 'http://noisiv.fr', icon: Icons.Portfolio },
      { url: 'https://www.linkedin.com/in/lucas-dussouchaud-67b492166/', icon: Icons.LinkedIn }
    ]
  },
  {
    fullname: 'Jordan Vilsaint',
    description: 'Sons et ambiences sonores',
    links: [
      { url: 'http://jovsn.alwaysdata.net', icon: Icons.Portfolio },
      { url: 'https://github.com/jovsn', icon: Icons.Github },
      { url: 'https://linkedin.com/in/jordan-v-7b7734b0', icon: Icons.LinkedIn },
    ]
  },
  {
    fullname: 'Christina Schinzel',
    description: 'UX/UI Design',
    links: []
  }
];

interface ICollaboratorLink {
  url: string;
  icon: string;
}

interface ICollaboratorProps {
  fullname: string;
  description?: string;
  links?: ICollaboratorLink[];
}

class Collaborator extends React.Component<ICollaboratorProps, any> {
  render() {
    const { fullname, description, links } = this.props;
    return (
      <div className='collaborator mb-3'>
        <div className='collaborator__info mb-1'>
          <h4 className='collaborator__fullname mb-1 mb-0-t mr-2-t'>{fullname}</h4>
          <ul className='collaborator__links'>
            {links.map(({ url, icon }, i) => (<li key={i} className='mr-2'>
              <a target='_blank' href={url} className='collaborator__link'><span className={classNames(`icon-${icon}`)} /></a>
            </li>))}
          </ul>
        </div>
        <p className='collaborator__description'>{description}</p>
      </div>
    );
  }
}

class Credits extends React.Component {
  render() {
    return (
      <div className='credits p-3 pt-2 pb-2'>
        <ul className='credits__collaborators'>
          {collaborators.map((collaborator, i) => <li key={i}><Collaborator {...collaborator} /></li>)}
        </ul>
      </div>
    );
  }
}

export default Credits;
