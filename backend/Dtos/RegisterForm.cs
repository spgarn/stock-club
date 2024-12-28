namespace club.Dtos
{
    public sealed class RegisterForm
    {
        /// <summary>
        /// The user's email address which acts as a user name.
        /// </summary>
        public required string Email { get; init; }

        /// <summary>
        /// The user's password.
        /// </summary>
        public required string Password { get; init; }

        public required string FirstName { get; init; }

        public required string LastName { get; init; }

        //public required string UserName { get; init; }
    }

}
