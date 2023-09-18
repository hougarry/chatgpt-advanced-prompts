import React from 'react'
import { GitHubButtonProps } from 'github-buttons'

interface ReactGitHubButtonProps extends GitHubButtonProps {
  children?: React.ReactNode;
}

export default class GitHubButton extends React.PureComponent<ReactGitHubButtonProps> {}
